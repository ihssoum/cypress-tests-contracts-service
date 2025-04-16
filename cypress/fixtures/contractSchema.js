export const contractResponseSchema = {
  type: "object",
  required: ["status", "message", "codeMessage", "data"],
  properties: {
    status: { type: "string" },
    message: { type: "string" },
    codeMessage: { type: "string" },
    data: {
      type: "object",
      required: ["contractInstance", "signatureMatrices", "thresholdLimitsDto"],
      properties: {
        contractInstance: {
          type: "object",
          required: [
            "id", "createdByAdmin", "publicKey", "clientCategory", "subProduct",
            "contractNature", "contractType", "validationLevel", "isActive", "status",
            "validationStatus", "creationDate", "validationDate", "activationDate",
            "suspensionDate", "rejectionDate", "cancelDate"
          ],
          properties: {
            id: { type: "number" },
            createdByAdmin: { type: "boolean" },
            publicKey: { type: "string" },
            clientCategory: { type: "string" },
            subProduct: { type: "string" },
            contractNature: { type: "string" },
            contractType: { type: "string" },
            validationLevel: { type: "number" },
            isActive: { type: "boolean" },
            status: { type: "string" },
            validationStatus: { type: "string" },
            creationDate: { type: "string", format: "date-time" },
            validationDate: { type: "string", format: "date-time" },
            activationDate: { type: "string", format: "date-time" },
            suspensionDate: { type: ["string", "null"], format: "date-time" },
            rejectionDate: { type: ["string", "null"], format: "date-time" },
            cancelDate: { type: ["string", "null"], format: "date-time" }
          }
        },
        signatureMatrices: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "clientSegment", "currency", "minAmount", "maxAmount", "isActive"],
            properties: {
              id: { type: "number" },
              clientSegment: { type: "string" },
              currency: { type: "string" },
              minAmount: { type: "number" },
              maxAmount: { type: "number" },
              isActive: { type: "boolean" }
            }
          }
        },
        thresholdLimitsDto: {
          type: "object",
          required: [
            "montantMinVirUnitWeb", "montantMaxVirUnitWeb", "montantMaxVirTotalWeb",
            "montantMinVirUnitMobile", "montantMaxVirUnitMobile", "montantMaxVirTotalMobile"
          ],
          properties: {
            montantMinVirUnitWeb: { type: "number" },
            montantMaxVirUnitWeb: { type: "number" },
            montantMaxVirTotalWeb: { type: "number" },
            montantMinVirUnitMobile: { type: "number" },
            montantMaxVirUnitMobile: { type: "number" },
            montantMaxVirTotalMobile: { type: "number" }
          }
        }
      }
    }
  }
};
