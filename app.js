const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const app = express()

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ]
  },
  apis: ['app.js'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use(express.json())
app.use(express.urlencoded({extended:false}))

var fakeDatabase = [
  {
    id: 1,
    title: 'Harry Potter'
  },
  {
    id: 2,
    title: 'Stand By Me'
  },
]



//GET

/** 
 * @swagger
 * /books:
 *    get:
 *      summary: Get the all books
 *      description: Get all books
 *      tags: [Books]
 *      responses:
 *        200:
 *          description: Success
*/
app.get('/books', (req, res)=>{
  res.send(fakeDatabase)
})

/** 
 * @swagger
 * /books/{id}:
 *    get:
 *      summary: Get the book by id
 *      tags: [Books]
 *      parameters:
 *        - in: path
 *          name: id
 *          sechma:
 *            type: string
 *            required: true
 *            descriptioon: The book id
 *      responses:
 *        200:
 *          description: The book description by id.
 *          contens:
 *            application/json:
 *        404:
 *          description: The book was not found.
*/
app.get('/books/:id', (req, res)=>{
  let data = req.params
  let id = Number(data.id)
  let returnObj = fakeDatabase.filter(el=>{
    return el.id === id
  })
  if(returnObj.length>0) {
    res.status(200).send(returnObj)
    res.end()
  } else {
    res.sendStatus(404)
    res.end()
  }
})

//POST

/** 
 * @swagger
 * /books:
 *    post:
 *      summary: Create a new book
 *      consumes:
 *        -application/json
 *      description: Create a new book
 *      tags: [Books]
 *      parameters:
 *      - name: title
 *        description: title of the book
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - title
 *          properties:
 *            title:
 *              type: string
 *      responses:
 *        200:
 *          description: The book was successfully created
 *          content:
 *            application/json
 *        500:
 *          description: Some server error
*/
app.post('/books', (req, res)=>{
  console.log(req.body)
  const data = req.body
  if(data.title !== "") {
    fakeDatabase.push({id: fakeDatabase.length+1, title: data.title})
    console.log(fakeDatabase);
    res.status(200).send(data)
    res.end()
  } else {
    res.status(404).send('Post object form error!')
  }
})

// PUT

/** 
 * @swagger
 * /books:
 *    put:
 *      summary: Create a new book
 *      consumes:
 *        -application/json
 *      description: Create a new book
 *      tags: [Books]
 *      parameters:
 *      - name: title
 *        description: title of the book
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - id
 *            - title
 *          properties:
 *            id:
 *              type: string
 *            title:
 *              type: string
 *      responses:
 *        200:
 *          description: The book was successfully created
 *          content:
 *            application/json
 *        404:
 *          description: Not Found
*/

app.put('/books', (req, res)=>{
  const data = req.body
  let targetNum = fakeDatabase.findIndex(x => x.id === Number(data.id))
  if(targetNum !== -1) {
    fakeDatabase = fakeDatabase.map((el,i)=>{
      if(targetNum === i) {
        el.title = data.title
      }
      return el
    })
    res.status(200).send(`update ID:${data.id}`)
    console.log(fakeDatabase)
  } else {
    res.status(404).send(`Not found ID:${data.id}`)
  }
})

// DELETE

/** 
 * @swagger
 * /books/{id}:
 *    delete:
 *      summary: Delete a book
 *      tags: [Books]
 *      parameters:
 *        - in: path
 *          name: id
 *          sechma:
 *            type: string
 *            required: true
 *            descriptioon: The book id
 *      responses:
 *        200:
 *          description: The book description by id.
 *          contens:
 *            application/json:
 *        404:
 *          description: The book was not found.
*/
app.delete("/books/:id", (req, res)=>{
  const data = req.params
  if(fakeDatabase.findIndex(x => x.id === Number(data.id)) !== -1) {
    fakeDatabase = fakeDatabase.filter(el=>{
      return el.id !== Number(data.id)
    })
    res.status(200).send(`delete ID:${data.id}`)
    console.log(fakeDatabase)
  } else {
    res.status(404).send(`Not found ID:${data.id}`)
  }
})




app.listen(5000, ()=> console.log("listening on 5000"))