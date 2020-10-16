import PropertyTypes from 'enums/PropertyTypes';
import CornerRadius from "./CornerRadius";
import StrokeWidthAlign from "./StrokeWidthAlign";
import FillColor from "./FillColor";
import StrokeFill from "./StrokeFill";
import Opacity from "./Opacity";
import Font from "./Font";
import Spacing from "./Spacing";

export default {
  [PropertyTypes.CORNER_RADIUS]: CornerRadius,
  [PropertyTypes.FILL_COLOR]: FillColor,
  [PropertyTypes.OPACITY]: Opacity,
  [PropertyTypes.STROKE_FILL]: StrokeFill,
  [PropertyTypes.STROKE_WIDTH_ALIGN]: StrokeWidthAlign,
  [PropertyTypes.FONT]: Font,
  [PropertyTypes.SPACING]: Spacing,
};
