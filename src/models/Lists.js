import moduleSchema from 'mongoose';
const { Schema, model } = moduleSchema;

const listSchema = new Schema({
    idList: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    title: {
        type: String,
        required: true
    }, 
    urlImg: {
        type: String,
        required: true
    },
    typeList: {
        type: String,
        required: true
    },
    // favourite: {
    //     type: Boolean,
    //     default: false
    // },
    // seen: {
    //     type: Boolean,
    //     default: false
    // }
}, {
    timestamps: true
})

export default model('List', listSchema)