<template>
  <div id="app" class="container">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Add New Books</h3>
      </div>
      <div class="panel-body">
        <form id="form" class="form-inline" v-on:submit.prevent="addBook">
          <div class="form-group">
            <label for="bookTitle">Title:</label>
            <input type="text" id="bookTitle" class="form-control" v-model="newBook.title">
          </div>
          <div class="form-group">
            <label for="bookAuthor">Descripion:</label>
            <input type="text" id="bookAuthor" class="form-control" v-model="newBook.author">
          </div>
          <div class="form-group">
            <label for="bookUrl">Url:</label>
            <input type="text" id="bookUrl" class="form-control" v-model="newBook.url">
          </div>
          <input type="submit" class="btn btn-primary" value="Add Book">
        </form>
        <br>
        <h1 v-if="errors.length > 0">
        <ul class="alert alert-danger">
          <li v-for="(error, index) in errors" v-bind:key="index">{{ error }}</li>
        </ul>
        </h1>>
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
            <th>Title</th>
            <th>Author</th>
            <th></th>
          </tr>
          </thead>
          <tbody
            name="custom-classes-transition"
            enter-active-class="animated tada"
            leave-active-class="animated bounceOutRight"
            is="transition-group"
          >
          <tr
            v-for="book in books"
            v-bind:key="book['.key']"
          >
            <td><a v-bind:href="book.url">{{book.title}}</a></td>
            <td>{{book.author}}</td>
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
          title: '',
          author: '',
          url: 'http://'
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
        if(!this.newBook.title) this.errors.push("Name required.");
        if(!this.newBook.author) this.errors.push("Author required.");
        e.preventDefault();
        if(this.errors == '') {
          booksRef.push(this.newBook);
          this.newBook.title = '';
          this.newBook.author = '';
          this.newBook.url = 'http://';
          toastr.success('Book added successfully')
        }
      },
      removeBook(book) {
        booksRef.child(book['.key']).remove()
        toastr.success('Book removed successfully')
      }
    },
  }
</script>
<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 20px;
  }

  ul li {
    list-style-type: none;
  }
</style>
