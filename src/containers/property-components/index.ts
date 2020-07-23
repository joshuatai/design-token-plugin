import PropertyTypes from 'enums/PropertyTypes';
import CornerRadius from './CornerRadius';
import StrokeWidthAlign from './StrokeWidthAlign';
import FillColor from './FillColor';

export default ($)=> ({
  [PropertyTypes.CORNER_RADIUS]: CornerRadius($),
  [PropertyTypes.STROKE_WIDTH_ALIGN]: StrokeWidthAlign($),
  [PropertyTypes.FILL_COLOR]: FillColor($)
});