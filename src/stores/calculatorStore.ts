import { create } from 'zustand';
import type {
  CalculatorMode,
  PropertyType,
  ProFormaInputs,
  NapkinInputs,
  CoreMetrics,
  CommercialMetrics,
  CashFlowYear,
  EquityMetrics,
  SensitivityMatrix,
} from '@/lib/finance/types';
import type { PropertyLookupResult } from '@/lib/api/types';
import { DEFAULT_PROFORMA, DEFAULT_NAPKIN } from '@/lib/finance/defaults';
import { computeCoreMetrics } from '@/lib/finance/core-metrics';
import { computeCommercialMetrics } from '@/lib/finance/commercial';
import { generateCashFlowProjection } from '@/lib/finance/cash-flow';
import { calcEquityMetrics } from '@/lib/finance/equity';
import { calcIRR } from '@/lib/finance/irr';
import { generateSensitivityMatrix } from '@/lib/finance/sensitivity';
import { napkinToProForma } from '@/lib/finance/napkin';

interface CalculatorState {
  mode: CalculatorMode;
  propertyType: PropertyType;
  napkinInputs: NapkinInputs;
  proFormaInputs: ProFormaInputs;

  // Address lookup
  addressQuery: string;
  propertyLookup: PropertyLookupResult | null;
  lookupLoading: boolean;
  lookupError: string | null;

  // Computed results
  coreMetrics: CoreMetrics | null;
  commercialMetrics: CommercialMetrics | null;
  cashFlowProjection: CashFlowYear[];
  equityMetrics: EquityMetrics | null;
  irr: number;
  sensitivityMatrix: SensitivityMatrix | null;

  // Actions
  setMode: (mode: CalculatorMode) => void;
  setPropertyType: (type: PropertyType) => void;
  updateNapkinInputs: (inputs: Partial<NapkinInputs>) => void;
  updatePurchaseInputs: (inputs: Partial<ProFormaInputs['purchase']>) => void;
  updateRenovationInputs: (inputs: Partial<ProFormaInputs['renovation']>) => void;
  updateIncomeInputs: (inputs: Partial<ProFormaInputs['income']>) => void;
  updateExpenseInputs: (inputs: Partial<ProFormaInputs['expenses']>) => void;
  updateCommercialInputs: (inputs: Partial<ProFormaInputs['commercial']>) => void;
  updateExitInputs: (inputs: Partial<ProFormaInputs['exit']>) => void;
  recalculate: () => void;

  // Address lookup actions
  setAddressQuery: (query: string) => void;
  applyPropertyLookup: (data: PropertyLookupResult) => void;
  setLookupLoading: (loading: boolean) => void;
  setLookupError: (error: string | null) => void;
  clearLookup: () => void;
}

function computeAll(inputs: ProFormaInputs, propertyType: PropertyType) {
  const coreMetrics = computeCoreMetrics(inputs);
  const commercialMetrics = propertyType === 'commercial'
    ? computeCommercialMetrics(inputs)
    : null;
  const cashFlowProjection = generateCashFlowProjection(inputs);
  const equityMetrics = calcEquityMetrics(inputs, cashFlowProjection);

  // Build IRR cash flows
  const totalCashInvested = coreMetrics.totalCashInvested;
  const lastYear = cashFlowProjection[cashFlowProjection.length - 1];
  const exitNoi = lastYear ? lastYear.noi : coreMetrics.noi;
  const exitCapRate = inputs.exit.exitCapRate / 100;
  const salePrice = exitCapRate > 0 ? exitNoi / exitCapRate : 0;
  const sellingCosts = salePrice * (inputs.exit.sellingCostPercent / 100);
  const netSaleProceeds = salePrice - sellingCosts - (lastYear ? lastYear.loanBalance : 0);

  const irrCashFlows = [
    -totalCashInvested,
    ...cashFlowProjection.map((y, idx) =>
      idx === cashFlowProjection.length - 1 ? y.cashFlow + netSaleProceeds : y.cashFlow
    ),
  ];
  const irr = calcIRR(irrCashFlows);

  const sensitivityMatrix = generateSensitivityMatrix(inputs);

  return { coreMetrics, commercialMetrics, cashFlowProjection, equityMetrics, irr, sensitivityMatrix };
}

export const useCalculatorStore = create<CalculatorState>((set, get) => {
  const initialResults = computeAll(DEFAULT_PROFORMA, 'residential');

  return {
    mode: 'napkin',
    propertyType: 'residential',
    napkinInputs: { ...DEFAULT_NAPKIN },
    proFormaInputs: { ...DEFAULT_PROFORMA },
    addressQuery: '',
    propertyLookup: null,
    lookupLoading: false,
    lookupError: null,
    ...initialResults,

    setMode: (mode) => {
      const state = get();
      if (mode === 'proforma' && state.mode === 'napkin') {
        // Convert napkin to pro-forma preserving values
        const proFormaInputs = napkinToProForma(state.napkinInputs);
        const results = computeAll(proFormaInputs, state.propertyType);
        set({ mode, proFormaInputs, ...results });
      } else if (mode === 'napkin' && state.mode === 'proforma') {
        // Extract napkin values from pro-forma
        const napkinInputs: NapkinInputs = {
          purchasePrice: state.proFormaInputs.purchase.purchasePrice,
          monthlyRent: state.proFormaInputs.income.monthlyRent,
          interestRate: state.proFormaInputs.purchase.interestRate,
        };
        set({ mode, napkinInputs });
      } else {
        set({ mode });
      }
    },

    setPropertyType: (propertyType) => {
      const state = get();
      const inputs = { ...state.proFormaInputs, propertyType };
      const results = computeAll(inputs, propertyType);
      set({ propertyType, proFormaInputs: inputs, ...results });
    },

    updateNapkinInputs: (partial) => {
      const state = get();
      const napkinInputs = { ...state.napkinInputs, ...partial };
      const proFormaInputs = napkinToProForma(napkinInputs);
      const results = computeAll(proFormaInputs, state.propertyType);
      set({ napkinInputs, proFormaInputs, ...results });
    },

    updatePurchaseInputs: (partial) => {
      const state = get();
      const proFormaInputs = {
        ...state.proFormaInputs,
        purchase: { ...state.proFormaInputs.purchase, ...partial },
      };
      const results = computeAll(proFormaInputs, state.propertyType);
      set({ proFormaInputs, ...results });
    },

    updateRenovationInputs: (partial) => {
      const state = get();
      const proFormaInputs = {
        ...state.proFormaInputs,
        renovation: { ...state.proFormaInputs.renovation, ...partial },
      };
      const results = computeAll(proFormaInputs, state.propertyType);
      set({ proFormaInputs, ...results });
    },

    updateIncomeInputs: (partial) => {
      const state = get();
      const proFormaInputs = {
        ...state.proFormaInputs,
        income: { ...state.proFormaInputs.income, ...partial },
      };
      const results = computeAll(proFormaInputs, state.propertyType);
      set({ proFormaInputs, ...results });
    },

    updateExpenseInputs: (partial) => {
      const state = get();
      const proFormaInputs = {
        ...state.proFormaInputs,
        expenses: { ...state.proFormaInputs.expenses, ...partial },
      };
      const results = computeAll(proFormaInputs, state.propertyType);
      set({ proFormaInputs, ...results });
    },

    updateCommercialInputs: (partial) => {
      const state = get();
      const proFormaInputs = {
        ...state.proFormaInputs,
        commercial: { ...state.proFormaInputs.commercial, ...partial },
      };
      const results = computeAll(proFormaInputs, state.propertyType);
      set({ proFormaInputs, ...results });
    },

    updateExitInputs: (partial) => {
      const state = get();
      const proFormaInputs = {
        ...state.proFormaInputs,
        exit: { ...state.proFormaInputs.exit, ...partial },
      };
      const results = computeAll(proFormaInputs, state.propertyType);
      set({ proFormaInputs, ...results });
    },

    recalculate: () => {
      const state = get();
      const results = computeAll(state.proFormaInputs, state.propertyType);
      set(results);
    },

    setAddressQuery: (addressQuery) => set({ addressQuery }),

    setLookupLoading: (lookupLoading) => set({ lookupLoading }),

    setLookupError: (lookupError) => set({ lookupError }),

    applyPropertyLookup: (data) => {
      const state = get();

      const napkinInputs: NapkinInputs = {
        ...state.napkinInputs,
        purchasePrice: data.estimatedValue,
        monthlyRent: data.rentEstimate,
      };

      const proFormaInputs: ProFormaInputs = {
        ...state.proFormaInputs,
        purchase: { ...state.proFormaInputs.purchase, purchasePrice: data.estimatedValue },
        income: { ...state.proFormaInputs.income, monthlyRent: data.rentEstimate },
        expenses: {
          ...state.proFormaInputs.expenses,
          propertyTaxRate: data.propertyTaxRate,
          insuranceAnnual: data.insuranceAnnual,
        },
      };

      const results = computeAll(proFormaInputs, state.propertyType);
      set({
        napkinInputs,
        proFormaInputs,
        propertyLookup: data,
        lookupLoading: false,
        lookupError: null,
        ...results,
      });
    },

    clearLookup: () => set({
      addressQuery: '',
      propertyLookup: null,
      lookupLoading: false,
      lookupError: null,
    }),
  };
});
