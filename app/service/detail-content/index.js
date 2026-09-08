import { detail as flooring } from "../catalog/golvlaggning";
import { detail as kitchenInstallation } from "../catalog/koksmontering";
import { detail as carpentry } from "../catalog/snickeri";
import { constructionDetailContent } from "./construction";
import { renovationDetailContent } from "./renovation";

export const serviceDetailContent = {
  ...renovationDetailContent,
  ...constructionDetailContent,
  golvlaggning: flooring,
  koksmontering: kitchenInstallation,
  snickeri: carpentry,
};
