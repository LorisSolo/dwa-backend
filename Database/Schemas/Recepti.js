const mongoose  = require("mongoose");

const ReceptiSchema = new mongoose.Schema({
    title:{
        type: mongoose.SchemaTypes.String,
        require:true
    },
    ingredients:{
        type: [mongoose.SchemaTypes.String],
        require:true
    },
    description:{
        type: mongoose.SchemaTypes.String,
        require: true
    },

    picture: {
        name: {
            type: mongoose.SchemaTypes.String,
        },
        image: {
            data: mongoose.SchemaTypes.Buffer,
            contentType: mongoose.SchemaTypes.String
        }
    },
    
    })

module.exports = mongoose.model('recepti', ReceptiSchema)