<template>
  <div id="app" class="container">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Add New Books</h3>
      </div>
      <div class="panel-body">
        <form id="form" class="form-inline" v-on:submit.prevent="addBook">
          <div class="form-group">
            <label for="bookName">Name:</label><br>
            <input type="text" id="bookName" class="form-control" v-model="newBook.name">
          </div>
          <div class="form-group">
            <label for="bookDescription">Description:</label><br>
            <input type="text" id="bookDescription" class="form-control" v-model="newBook.description">
          </div>
          <div class="form-group">
            <label for="bookPrice">Price:</label><br>
            <input type="text" id="bookPrice" class="form-control" v-model="newBook.price">
          </div>
          <div class="form-group">
            <label for="bookCategory">Category:</label><br>
              <select class="form-control" id ="bookCategory" v-model="newBook.category">
              <option>Technology</option>
              <option>University</option>
              <option>Love</option>
            </select>
          </div>

          <div class="form-group">
            <label for="bookImage">Choose image </label>
            <input type="file" class="form-control-file" id ="bookImage" v-on:change="changedImage"  >
            <!--<input type="file" @change="onFileChanged">-->
          </div>
          <input type="submit" class="btn btn-primary" value="Add Book">
        </form>
        <br>
        <h6 v-if="errors.length > 0">
        <ul class="alert alert-danger">
          <li v-for="(error, index) in errors" v-bind:key="index">{{ error }}</li>
        </ul>
        </h6>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Book List</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
            <th> </th>
          </tr>
          </thead>
          <tbody
            name="custom-classes-transition"
            enter-active-class="animated tada"
            leave-active-class="animated bounceOutRight"
            is="transition-group"
          >
          <tr v-for="book in books" v-bind:key="book['.key']">
            <td><a >{{book.name}}</a></td>
            <td>{{book.description}}</td>
            <td>{{book.price}}</td>
            <td>{{book.category}}</td>
            <td><img :src="src" :alt="book.image"/></td>
            <td><span class="glyphicon glyphicon-trash" aria-hidden="true" v-on:click="removeBook(book)"></span></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import Firebase from 'firebase'
  import toastr from 'toastr'

  let config = {
    apiKey: "AIzaSyCv5D85muOhxDsTN9SpHTSLrQeMcXvnHSQ",
    authDomain: "lap2-upload.firebaseapp.com",
    databaseURL: "https://lap2-upload.firebaseio.com",
    projectId: "lap2-upload",
    storageBucket: "lap2-upload.appspot.com",
    messagingSenderId: "577645294647"

  };

  let app = Firebase.initializeApp(config)
  let db = app.database()
  let booksRef = db.ref('books')

  export default {
    name: 'app',
    data () {
      return {
        newBook: {
          name: '',
          description: '',
          price:'',
          category:'',
          image: null,
          url: '',
          id:''
        },
        errors: []
      }
    },
    firebase: {
      books: booksRef
    },
    methods: {

      addBook(e) {
        this.errors = [''];
        if(!this.newBook.name) this.errors.push("Name required.");
        if(!this.newBook.description) this.errors.push("Description required.");
        if(!this.newBook.price) this.errors.push('Price required.');
         if(!this.newBook.category) this.errors.push('Category required.');
        e.preventDefault();
        if(this.errors == '') {
          booksRef.push(this.newBook);


          this.newBook.name = '';
          this.newBook.description = '';
          this.newBook.price ='';
          this.newBook.category='';
          this.newBook.id ='';
          this.newBook.image = null

          toastr.success('Book added successfully')
        }
      },
      removeBook(book) {
        booksRef.child(book['.key']).remove()
        toastr.success('Book removed successfully')
      },
      changedImage (event) {
        this.newBook.image = event.target.files[0]
      },

    },
  }
</script>
<link ref="style " href="style.css">
