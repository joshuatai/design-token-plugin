import PropertyTypes from 'enums/PropertyTypes';
import CornerRadius from './CornerRadius';
import StrokeWidthAlign from './StrokeWidthAlign';

export default ($)=> ({
  [PropertyTypes.CORNER_RADIUS]: CornerRadius($),
  [PropertyTypes.STROKE_WIDTH_ALIGN]: StrokeWidthAlign($)
});