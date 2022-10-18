import shortid from "shortid";

const FixShortId = {
    generate(prefix = 'i'){
        return `${prefix}_${shortid.generate().split('-').join('_')}`;
    }
}
export default FixShortId;