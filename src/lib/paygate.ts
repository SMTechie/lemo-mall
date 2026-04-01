import crypto from "node:crypto";

const PAYGATE_INITIATE_URL =
  "https://secure.paygate.co.za/payweb3/initiate.trans";
const PAYGATE_PROCESS_URL =
  "https://secure.paygate.co.za/payweb3/process.trans";

export type PayGateInitiateInput = {
  paygateId: string;
  encryptionKey: string;
  reference: string;
  amountCents: number;
  currency: string;
  returnUrl: string;
  transactionDate?: string;
  locale?: string;
  country?: string;
  email: string;
  notifyUrl?: string;
  payMethod?: string;
  payMethodDetail?: string;
  user1?: string;
  user2?: string;
  user3?: string;
  vault?: string;
  vaultId?: string;
};

export type PayGateInitiateResult = {
  payRequestId: string;
  checksum: string;
  payload: Record<string, string>;
};

export function hasPayGateCredentials() {
  return Boolean(process.env.PAYGATE_ID && process.env.PAYGATE_ENCRYPTION_KEY);
}

function md5(input: string) {
  return crypto.createHash("md5").update(input).digest("hex");
}

function concatFields(values: Array<string | undefined | null>, key: string) {
  return [...values.map((value) => value ?? ""), key].join("");
}

export function buildInitiateChecksum(
  input: Pick<
    PayGateInitiateInput,
    | "paygateId"
    | "reference"
    | "amountCents"
    | "currency"
    | "returnUrl"
    | "transactionDate"
    | "locale"
    | "country"
    | "email"
    | "payMethod"
    | "payMethodDetail"
    | "notifyUrl"
    | "user1"
    | "user2"
    | "user3"
    | "vault"
    | "vaultId"
  >,
  key: string,
) {
  return md5(
    concatFields(
      [
        input.paygateId,
        input.reference,
        String(input.amountCents),
        input.currency,
        input.returnUrl,
        input.transactionDate,
        input.locale,
        input.country,
        input.email,
        input.payMethod,
        input.payMethodDetail,
        input.notifyUrl,
        input.user1,
        input.user2,
        input.user3,
        input.vault,
        input.vaultId,
      ],
      key,
    ),
  );
}

export function buildProcessChecksum(
  input: {
    paygateId: string;
    payRequestId: string;
    reference: string;
    transactionStatus: string;
  },
  key: string,
) {
  return md5(
    concatFields(
      [
        input.paygateId,
        input.payRequestId,
        input.transactionStatus,
        input.reference,
      ],
      key,
    ),
  );
}

export function buildResponseChecksum(
  input: {
    paygateId: string;
    payRequestId: string;
    reference: string;
  },
  key: string,
) {
  return md5(concatFields([input.paygateId, input.payRequestId, input.reference], key));
}

export function buildPayGateProcessForm(input: {
  payRequestId: string;
  checksum: string;
}) {
  return {
    action: PAYGATE_PROCESS_URL,
    fields: {
      PAY_REQUEST_ID: input.payRequestId,
      CHECKSUM: input.checksum,
    },
  };
}

export async function initiatePayGateTransaction(
  input: PayGateInitiateInput,
): Promise<PayGateInitiateResult> {
  const checksum = buildInitiateChecksum(input, input.encryptionKey);
  const payload: Record<string, string> = {
    PAYGATE_ID: input.paygateId,
    REFERENCE: input.reference,
    AMOUNT: String(input.amountCents),
    CURRENCY: input.currency,
    RETURN_URL: input.returnUrl,
    TRANSACTION_DATE:
      input.transactionDate ?? new Date().toISOString().replace("T", " ").slice(0, 19),
    LOCALE: input.locale ?? "en",
    COUNTRY: input.country ?? "ZAF",
    EMAIL: input.email,
    CHECKSUM: checksum,
  };

  if (input.notifyUrl) payload.NOTIFY_URL = input.notifyUrl;
  if (input.payMethod) payload.PAY_METHOD = input.payMethod;
  if (input.payMethodDetail) payload.PAY_METHOD_DETAIL = input.payMethodDetail;
  if (input.user1) payload.USER1 = input.user1;
  if (input.user2) payload.USER2 = input.user2;
  if (input.user3) payload.USER3 = input.user3;
  if (input.vault) payload.VAULT = input.vault;
  if (input.vaultId) payload.VAULT_ID = input.vaultId;

  const response = await fetch(PAYGATE_INITIATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`PayGate initiate request failed with ${response.status}`);
  }

  const text = await response.text();
  const parsed = Object.fromEntries(new URLSearchParams(text));
  const payRequestId = parsed.PAY_REQUEST_ID;

  if (!payRequestId) {
    throw new Error("PayGate response did not include PAY_REQUEST_ID");
  }

  return {
    payRequestId,
    checksum: parsed.CHECKSUM ?? buildResponseChecksum(
      {
        paygateId: payload.PAYGATE_ID,
        payRequestId,
        reference: payload.REFERENCE,
      },
      input.encryptionKey,
    ),
    payload: parsed as Record<string, string>,
  };
}

export function parsePayGateBody(body: string) {
  return Object.fromEntries(new URLSearchParams(body)) as Record<string, string>;
}

export function verifyPayGateResponseChecksum(
  payload: Record<string, string>,
  encryptionKey: string,
) {
  const expected = buildResponseChecksum(
    {
      paygateId: payload.PAYGATE_ID,
      payRequestId: payload.PAY_REQUEST_ID,
      reference: payload.REFERENCE,
    },
    encryptionKey,
  );

  return expected === payload.CHECKSUM;
}

export function verifyPayGateReturnChecksum(
  payload: Record<string, string>,
  encryptionKey: string,
) {
  const expected = buildProcessChecksum(
    {
      paygateId: payload.PAYGATE_ID,
      payRequestId: payload.PAY_REQUEST_ID,
      reference: payload.REFERENCE,
      transactionStatus: payload.TRANSACTION_STATUS,
    },
    encryptionKey,
  );

  return expected === payload.CHECKSUM;
}

export function isPayGateSuccess(payload: Record<string, string>) {
  return ["1", "00", "0", "000"].includes(payload.TRANSACTION_STATUS ?? payload.RESULT_CODE ?? "");
}

