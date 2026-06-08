import themeStyles from './_theme.scss?raw';
import baseStyles from './_base.scss?raw';
import layoutStyles from './_layout.scss?raw';
import symbolStyles from './_symbols.scss?raw';
import showcaseStyles from './_showcase.scss?raw';
import footerStyles from './_footer.scss?raw';
import responsiveStyles from './_responsive.scss?raw';
import motionStyles from './_motion.scss?raw';
import materialWebStyles from './_material-web.scss?raw';

const styleSheet = [
  themeStyles,
  baseStyles,
  layoutStyles,
  symbolStyles,
  showcaseStyles,
  footerStyles,
  responsiveStyles,
  motionStyles,
  materialWebStyles,
].join('\n');

const styleElement = document.createElement('style');
styleElement.dataset.symblyStyles = 'scss';
styleElement.textContent = styleSheet;
document.head.append(styleElement);
