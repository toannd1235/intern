var config = {
    apiKey: "AIzaSyD7tqUBKSzi03xX4yb8OX27toA8dw2fCpY",
    authDomain: "lab3-2c5bf.firebaseapp.com",
    databaseURL: "https://lab3-2c5bf.firebaseio.com",
    projectId: "lab3-2c5bf",
    storageBucket: "lab3-2c5bf.appspot.com",
    messagingSenderId: "971587876036"
};

firebase.initializeApp(config);

const database = firebase.firestore();

database.settings({
    timestampsInSnapshots: true
});

usersRef = database.collection("users");

var data;

$(document).ready(() => {
    fetchData();

    $("#add").click(() => {
        addAccount();
    });
    $(document).on("click touch", "#delete", (event) => {
        // let id = event.target.id.split("-").pop();
        deleteAccount(event.target.value);
    });

})

fetchData = () => {
    usersRef.get().then((res) => {
        let row = "";
        index = 0;
        res.forEach((e) => {
            index++;
            row += `<tr>
                        <td>${index}</td>
                        <td>${e.data().id}</td>
                        <td>${e.data().name}</td>
                        <td style="display:flex">
                            <button class="btn btn-danger" id="delete" value=${e.data().id}>Delete</button>
                        </td>
                    </tr>`;
            $("#dataTable").html(row);

        });
    });
}

addAccount = () => {
    let fbID;
    let fbName;
    let fbCookies;
    let tabID;
    chrome.tabs.query({ url: "https://www.facebook.com/*" }, function (tabs) {
        if (tabs[0] == undefined) {
            console.log("Tab Facebook is not active");
        } else {
            tabID = tabs[0].id;

            chrome.cookies.getAll({ "domain": ".facebook.com" }, (res) => {
                fbCookies = res;
                res.forEach((e) => {
                    if (e.name == "c_user") {
                        fbID = e.value;
                    };
                });
                chrome.tabs.sendMessage(tabID, "getName", (data) => {

                    fbName = data.name;

                    //console.log(data);
                    if (fbName === undefined) { }
                    else {
                        usersRef.doc(fbID).set({
                            name: fbName,
                            id: fbID,
                            cookies: fbCookies,
                        }).then(() => {
                            fetchData();
                            //console.log("set");
                        }).catch((err) => {
                            usersRef.doc(fbID).update({
                                name: fbName,
                                id: fbID,
                                cookies: fbCookies,
                            }).then(() => {
                                fetchData();
                                console.log("update");
                            });
                        });

                    }
                });
            });
        }

    });
}
deleteAccount = (e) => {
    usersRef.doc(e).delete().then(() => {
        fetchData();
    });
}
