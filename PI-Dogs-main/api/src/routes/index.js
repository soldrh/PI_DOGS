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
    const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds');
    const apiInfo = await apiUrl.data.map(el => {
        return {
            id: el.id,
            name: el.name,
            heightMin: el.height,
            heightMax: el.heightMax,
            weightMin: el.weightMin,
            weightMax: el.weightMax,
            life_span: el.life_span,
            temperament: el.temperament,
            image: el.image
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
        res.status(404).send("No existe esa raza");
    }else{
        res.status(200).send(dogsTotal)
    }
})

/*
[ ] __GET /temperament__:
  - Obtener todos los temperamentos posibles
  - En una primera instancia deberán obtenerlos desde la API externa y guardarlos en su propia base de datos y luego ya utilizarlos desde allí
  VER PORQUE DEBE DEVOLVER STRINGS SEPARADOS CON COMA 
*/

  router.get('/temperaments', async (req, res) => {
    const temperamentApi = await axios.get('https://api.thedogapi.com/v1/breeds');
    const temperament = temperamentApi.data.map(el => el.temperament)
    const temperamentEach = temperament.map(el => {
        for (let i=0; i<el.length; i++) {
            return el[i]}})
        temperamentEach.forEach(el => {
            Temperament.findOrCreate({
                where: { name: el }
            })
        })
        const allTemperaments = await Temperament.findAll();
        res.send(allTemperaments);
    })


   router.post('/dogs', async (req, res) => {
    let {
        name,
       weightMin,
        weightMax,
        heightMin,
        heightMax,
        life_span,
        createIdDb,
        temperament,
        image        
    } = req.body

    let dogCreated = await Dogs.create ({
        name,
        weightMin,
        weightMax,
        heightMin,
        heightMax,
        life_span,
        createIdDb,
        image
    })
    let temperamentDb = await Temperament.findAll({
        where: {name : temperament}
    })
    dogCreated.addTemperament(temperamentDb)
    res.status(200).send('Perro creado con exito')
})


router.get('/dogs/:id', async (req, res) => {
    const id = req.params.id;
    const dogsTotal = await getAllDogs()
    if (id){
        let dogId = await dogsTotal.filter(el => el.id == id)
        dogId.length?
        res.status(200).json(dogId) :
        res.status(404).send("No se encuentra esa raza")
    }
})



module.exports = router;

