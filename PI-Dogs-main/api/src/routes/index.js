const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require ('axios')
const {Temperament, Dogs} = require ('../db')
const router = Router();
const {
    API_KEY,
  } = process.env;

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const getApiInfo = async () => {
    const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds?API_KEY');
    const apiInfo = await apiUrl.data.map(el => {
        return {
            id: el.id,
            name: el.name,
            height: el.height,
            weight: el.weight,
            life_span: el.life_span,
            temperament: el.temperament
            };
    });
    return apiInfo;
};

const getDbInfo = async () => {
    return await Dogs.findAll({
        include:{
            model: Temperament,
            attributes: ['name'],
            through: {
                attributes: [],
            },
        }
    })
}

const getAllDogs = async () => {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const infoTotal = apiInfo.concat(dbInfo);
    return infoTotal;
}

router.get('/dogs', async (req, res) => {
    const name = req.query.name
    let dogsTotal = await getAllDogs();
    if(name){
        let dogName = await dogsTotal.filter(el => el.name.toLowerCase().includes(name.toLowerCase()))
        dogName.length ?
        res.status(200).send(dogName) :
        res.status(404).send("No esta la raza");
    }else{
        res.status(200).send(dogsTotal)
    }
})




module.exports = router;
