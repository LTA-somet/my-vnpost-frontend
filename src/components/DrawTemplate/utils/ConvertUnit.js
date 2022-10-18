export const cpi = 2.54;

export function px2Unit(px, unit, ppi){
  switch(unit.toLowerCase()){
    case 'in':
      return px/ppi;
    case 'cm':
      return (px/ppi)*cpi;
    case 'mm':
      return (px/ppi)*cpi*10;
    default:
      return px;
  }
}

export function unit2Px(val, unit, ppi){
  switch(unit.toLowerCase()){
    case 'in':
      return val*ppi;
    case 'cm':
      return (val/cpi)*ppi;
    case 'mm':
      return (val/cpi/10)*ppi;
    default://px
      return val;
  }
}

export function convert(val, fromUnit, toUnit, ppi){
  var px = unit2Px(val, fromUnit, ppi);
  return Math.round(px2Unit(px, toUnit, ppi) * 10) / 10;
}

const ConvertUnit = {
    px2Unit, unit2Px, convert
};
export default ConvertUnit;
