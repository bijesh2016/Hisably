const prisma = require('../../config/database');

/**
 * Compare POS sales paid via digital QR/Wallets against Payment ledger settlements
 */
const getQrReconciliation = async (query = {}) => {
  const { organizationId, startDate, endDate, method } = query;

  const dateFilter = startDate || endDate
    ? {
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      }
    : {};

  // 1. Fetch Sales where payments were made via digital QR channels
  const qrMethods = method ? [method] : ['QR', 'ESEWA', 'KHALTI', 'CONNECT_IPS', 'IME_PAY'];

  const salesWithQr = await prisma.sale.findMany({
    where: {
      deletedAt: null,
      ...(organizationId && { organizationId }),
      ...dateFilter,
      payments: {
        some: {
          method: { in: qrMethods },
        },
      },
    },
    include: {
      customer: true,
      payments: {
        where: {
          method: { in: qrMethods },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // 2. Fetch logged Payments under reconciliation
  const digitalPayments = await prisma.payment.findMany({
    where: {
      deletedAt: null,
      ...(organizationId && { organizationId }),
      ...dateFilter,
      method: { in: qrMethods },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate totals
  const expectedQrTotal = salesWithQr.reduce((sum, sale) => {
    const qrSum = sale.payments.reduce((pSum, p) => pSum + Number(p.amount || 0), 0);
    return sum + (qrSum || Number(sale.paidAmount || sale.totalAmount || 0));
  }, 0);

  const receivedSettlementsTotal = digitalPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const discrepancy = Math.abs(expectedQrTotal - receivedSettlementsTotal);
  const isReconciled = discrepancy < 0.01;

  // Breakdown by channel (eSewa, Khalti, Fonepay QR, ConnectIPS)
  const channelBreakdown = qrMethods.map((ch) => {
    const saleVol = salesWithQr.reduce((sum, s) => {
      const pAmt = s.payments.filter((p) => p.method === ch).reduce((acc, p) => acc + Number(p.amount), 0);
      return sum + pAmt;
    }, 0);
    const settledVol = digitalPayments.filter((p) => p.method === ch).reduce((acc, p) => acc + Number(p.amount), 0);
    return {
      channel: ch,
      expected: saleVol,
      settled: settledVol,
      discrepancy: Math.abs(saleVol - settledVol),
      status: Math.abs(saleVol - settledVol) < 0.01 ? 'MATCHED' : 'UNMATCHED',
    };
  });

  // Mapped transaction items for reconciliation review
  const transactions = salesWithQr.map((sale) => {
    const qrPayment = sale.payments[0];
    return {
      id: sale.id,
      saleNumber: sale.saleNumber,
      date: sale.saleDate || sale.createdAt,
      customerName: sale.customer?.name || 'Walk-in Retail Customer',
      amount: Number(qrPayment?.amount || sale.paidAmount || sale.totalAmount || 0),
      method: qrPayment?.method || 'QR',
      reference: qrPayment?.reference || `REF-${sale.saleNumber}`,
      status: sale.paymentStatus === 'PAID' ? 'RECONCILED' : 'PENDING_MATCH',
      verified: sale.paymentStatus === 'PAID',
    };
  });

  return {
    summary: {
      expectedQrTotal,
      receivedSettlementsTotal,
      discrepancy,
      isReconciled,
      reconciliationRate: expectedQrTotal > 0 ? Math.min(100, Math.round((receivedSettlementsTotal / expectedQrTotal) * 100)) : 100,
      totalTransactions: salesWithQr.length,
    },
    channelBreakdown,
    transactions,
  };
};

const reconcileAll = async (data = {}) => {
  const { saleIds = [] } = data;
  if (saleIds.length > 0) {
    await prisma.sale.updateMany({
      where: { id: { in: saleIds } },
      data: { paymentStatus: 'PAID' },
    });
  }
  return { success: true, message: 'All transactions marked as reconciled' };
};

module.exports = {
  getQrReconciliation,
  reconcileAll,
};
