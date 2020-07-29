import PropertyTypes from 'enums/PropertyTypes';
import CornerRadius from './CornerRadius';
import FillColor from './FillColor';
import StrokeWidthAlign from './StrokeWidthAlign';
import Opacity from './Opacity';
import Text from './Text';

export default ($)=> ({
  [PropertyTypes.CORNER_RADIUS]: CornerRadius($),
  [PropertyTypes.FILL_COLOR]: FillColor($),
  [PropertyTypes.STROKE_WIDTH_ALIGN]: StrokeWidthAlign($),
  [PropertyTypes.STROKE_FILL]: FillColor($),
  [PropertyTypes.OPACITY]: Opacity($),
  [PropertyTypes.TEXT]: Text($)
});