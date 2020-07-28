import PropertyTypes from 'enums/PropertyTypes';
import CornerRadius from './CornerRadius';
import FillColor from './FillColor';
import StrokeWidthAlign from './StrokeWidthAlign';


export default ($)=> ({
  [PropertyTypes.CORNER_RADIUS]: CornerRadius($),
  [PropertyTypes.FILL_COLOR]: FillColor($),
  [PropertyTypes.STROKE_WIDTH_ALIGN]: StrokeWidthAlign($),
  [PropertyTypes.STROKE_FILL]: FillColor($)
});