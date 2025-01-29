import dotenv from 'dotenv';
dotenv.config();

mongoose.connect('mongodb://etudiant:SAE501@reserver:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch((err) => console.log('Erreur de connexion à MongoDB', err));
