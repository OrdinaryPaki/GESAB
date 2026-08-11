import { constructionDetailContent } from "./construction";
import { renovationDetailContent } from "./renovation";

export const serviceDetailContent = {
  ...renovationDetailContent,
  ...constructionDetailContent,
};
