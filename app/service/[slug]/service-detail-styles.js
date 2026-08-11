import contentStyles from "./service-detail-content.module.css";
import faqStyles from "./service-detail-faq.module.css";
import quoteStyles from "./service-detail-quote.module.css";
import relatedStyles from "./service-detail-related.module.css";
import shellStyles from "./service-detail-shell.module.css";

const styles = {
  ...shellStyles,
  ...contentStyles,
  ...faqStyles,
  ...quoteStyles,
  ...relatedStyles,
};

export default styles;
