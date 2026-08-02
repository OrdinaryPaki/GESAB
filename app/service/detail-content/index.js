import { constructionDetailContent } from "./construction";
import { finishingDetailContent } from "./finishing";
import { renovationDetailContent } from "./renovation";

export const serviceDetailContent = {
  ...renovationDetailContent,
  ...constructionDetailContent,
  ...finishingDetailContent,
};
