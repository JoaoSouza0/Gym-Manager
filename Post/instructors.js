const fs = require('fs') //chamando filse server (fs) para conseguir manipular arquivos 
const data = require('../data.json')
const { calcularIdade, calcularData, searchInstructor } = require('../logic/logic')


//INDEX

exports.index = (req, res) => {

    return res.render('Instructors/index', { instructors: data.instructors })
}

//CREATE

exports.create = (req, res) => {
    return res.render('Instructors/create')
}

//SHOW

exports.show = (req, res) => { // criando rota para mostras as infos

    const { id } = req.params // pegando o parametro id

    let results = searchInstructor(id, res)
    
    const { encontrarEstrutor } = results

    const intrutores = {
        ...encontrarEstrutor, // espaçando o array
        age: calcularIdade(encontrarEstrutor.dataNascimento), // formatando a idade com base na data de nascimento
        services: encontrarEstrutor.services.split(','), // criando um array
        create_at: new Intl.DateTimeFormat('en-GB').format(encontrarEstrutor.create_at) //formatando o criado quando
    }

    return res.render('../views/Instructors/show', { infos: intrutores })
}

//Create

exports.edit = (req, res) => {

    const { id } = req.params // pegando o parametro id

    let results = searchInstructor(id, res)

    const { encontrarEstrutor } = results

    instructors = {
        ...encontrarEstrutor,
        dataNascimento: calcularData(encontrarEstrutor.dataNascimento).iso

    }

    return res.render('Instructors/edit', { instrutor: instructors }) //passando esse array para a pagina
}

//POST
exports.post = (req, res) => {

    const keys = Object.keys(req.body) // pegando as chaves dos itens
    // E fazendo 1 array com elas 
    let { avatarUrl, nomeInstrutor, dataNascimento, gender, services } = req.body // desestruturando o array body

    for (key of keys) {  // validando se todos os campos estão preenchidos

        keyisNull = req.body[key] == ""

        if (keyisNull)
            return res.send('Por favor preencher todos os itens')
    }


    dataNascimento = Date.parse(dataNascimento)
    const create_at = Date.now()
    const id = Number(data.instructors.length + 1)

    data.instructors.push({
        id,
        avatarUrl,
        nomeInstrutor,
        gender,
        services,
        dataNascimento,
        create_at
    }) //adicionando objetos no array instructors

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (error) => {
/*         criando arquivo('nome do arquivo', ('converter dados do body para jason', null, 'indentação),' 
            função de callback
 */        if (error) { //caso de erro enviar

            return res.send('Deu algum erro ao gerar o arquivo mano')
        }

        return res.redirect('/Instructors')//caso de sucesso redirecionar. 
    })

}

//ATUALIZAR

exports.put = (req, res) => {
    const { id } = req.body // pegando o parametro id

    let results = searchInstructor(id, res)

    const { encontrarEstrutor, index } = results

    const instructor = {

        ...encontrarEstrutor,
        ...req.body,
        dataNascimento: Date.parse(req.body.dataNascimento),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send('Write error bro')

        return res.redirect(`/instructors/${id}`)
    })

}

//DELETAR 

exports.delete = (req, res) => {

    const { id } = req.body

    const filterInstrutor = data.instructors.filter((instrutor) => {
        return instrutor.id != id
    })

    data.instructors = filterInstrutor

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {

        if (err) return res.send("Write file error")

        return res.redirect('/Instructors')
    })

}