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
    $("#clear").click(() => {
        addAccount();
    });

    $(document).on("click touch", "#delete", (event) => {
        // let id = event.target.id.split("-").pop();
        deleteAccount(event.target.value);
    });
    $(document).on("click touch", "#switch", (event) => {
        // let id = event.target.id.split("-").pop();
        switchAccount(event.target.value);
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
                            <!--<button class="btn btn-info " style="margin-right:5px" id="switch" value=${e.data().id}>Switch</button>-->
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
switchAccount = (uid) => {

    let tabID;
    let cookieNeeded;
    usersRef.get().then((docSnap) => {
        docSnap.forEach(doc => {
            if (uid === doc.id) {
                const cookies = doc.data().cookies;

                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i];
                    if(!cookie.name) {
                        continue;
                    }
                    delete cookie.hostOnly;
                    delete cookie.session;
                    chrome.cookies.set(
                        {
                            ...cookie,
                            "url": "https://.facebook.com" + cookie.path
                        }
                        , (res) => {
                            console.log(i, res.name);
                        });
                }
            }

        })
    })

    return;

    usersRef.get().then((res) => {
        res.forEach((v) => {
            if (v.id === e) {

                v.data().cookies.forEach((cookie) => {
                    //delete cookie.session;
                    //delete cookie.hostOnly;


                    if (cookie.name === "c_user") {
                        console.log(cookie);
                    }

                    chrome.cookies.set({
                        "url": "https://www.facebook.com" + cookie.path,
                        "name": cookie.name,
                        "value": cookie.value,
                        "domain": cookie.domain,
                        "path": cookie.path,
                        "secure": cookie.secure,
                        "httpOnly": cookie.httpOnly,
                        "sameSite": cookie.sameSite,
                        "expirationDate": cookie.expirationDate,
                        "storeId": cookie.storeId,
                    }, (res) => {
                        if (res.name === "c_user") {
                            console.log(res);
                        }
                    });
                });

            };
        });
    });

}


clearCookies = () => {
    chrome.browsingData.removeCookies(() => {
        console.log('done');

    })
}



