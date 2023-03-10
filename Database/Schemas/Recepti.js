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
    /*
    image: {
        data: mongoose.SchemaTypes.Buffer,
        contentType: mongoose.SchemaTypes.String
    }

*/
})

module.exports = mongoose.model('recepti', ReceptiSchema)