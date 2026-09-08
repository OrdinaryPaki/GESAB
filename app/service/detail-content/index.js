import { detail as kitchenInstallation } from "../catalog/koksmontering";
import { detail as carpentry } from "../catalog/snickeri";
import { constructionDetailContent } from "./construction";
import { renovationDetailContent } from "./renovation";

export const serviceDetailContent = {
  ...renovationDetailContent,
  ...constructionDetailContent,
  koksmontering: kitchenInstallation,
  snickeri: carpentry,
};
