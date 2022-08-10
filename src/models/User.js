import moduleSchema from 'mongoose';
const { Schema, model } = moduleSchema;

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [6, 'Minimo 6 caracteres de longitud'],
        maxlength: 255
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'Minimo 3 caracetres de longitud'],
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Minimo 6 caracteres de longitud'],
        maxlength: 255
    },
    imgUrl: {
        type: String,
        default: 'user.png'
    },
    lists: [
        {
            lista: {
                type: Schema.Types.ObjectId,
                ref: 'List'
            },
            favourite: {
                type: Boolean,
                default: false
            },
            seen: {
                type: Boolean,
                default: false
            }
        }
    ]
}, {
    timestamps: true
});

export default model('User', userSchema);