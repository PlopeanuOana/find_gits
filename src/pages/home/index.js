import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

import './style.css'

const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: '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' });

function Home() {
    let [usernameSearch, setUsernameSearch] = useState('');

    let [gistsForUsers, setGistsForUser] = useState([]);
    let [forkInfo, setForkInfo] = useState([]);

    async function fetchUserGists(e) {
        e.preventDefault();

        if (usernameSearch === '') {
            Swal.fire(
                'Error',
                'Plese insert an username',
                'error'
            )
        } else {
            const response = await octokit.request('GET /users/{username}/gists', {
                username: usernameSearch
            })
            let gists = response.data;

            if (gistsForUsers !== []) setGistsForUser([]);
            if (forkInfo !== []) setForkInfo([]);

            if (gists.length > 0) {
                let timerInterval;
                Swal.fire({
                    title: "Loading",
                    html: '<b></b>',
                    timer: 1000,
                    didOpen: async () => {
                        Swal.showLoading();
                        timerInterval = setInterval(() => {
                            const content = Swal.getHtmlContainer()
                            if (content) {
                                const b = content.querySelector('b')
                                if (b) {
                                    b.textContent = 'Waiting for gists to appear';
                                }
                            }
                        })
                        Swal.stopTimer()

                        await fetchForks(gists);
                        setGistsForUser(gists);


                        Swal.resumeTimer()
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false
                })
            } else {
                Swal.fire(
                    'Information',
                    'There are no gists for this username',
                    'info'
                )
            }

        }
    }

    function seeMoreAboutGist(e, url) {
        e.preventDefault();

        window.open(url);
    }

    async function fetchForks(gists) {
        let idToUser = {};
        for (let i = 0; i < gists.length; i++) {
            let info = gists[i];
            let result = await octokit.request('GET /gists/{gist_id}/forks', {
                gist_id: info.id
            });
            let infoFork = result.data.map((x) => { return { name: x.owner.login, image: x.owner.avatar_url } });

            let last3 = infoFork.slice(-3);
            idToUser[info.id] = last3;
        }

        setForkInfo(idToUser);
    }

    useEffect(() => {
    }, [gistsForUsers, forkInfo])

    let InformationTag = (info) => {
        let owner = info.owner;
        let file = info.files;
        let fileInfo = file[Object.keys(file)[0]];

        let raw_url = fileInfo.raw_url;
        return (
            <div className="col-lg-12 row special-grid">
                <div className="col-md-4 text-right">
                    <div className="d-flex flex-column">
                        <div className="p-2 d-flex flex-row-reverse">
                            <img src={owner.avatar_url} className="p-2 rounded-circle " alt="profile pic" width="70" height="70" />
                            <p>{owner.login}</p>
                        </div>
                        {forkInfo[info.id].map((info) => (
                            <div className="p-2 d-flex flex-row-reverse">
                                <img src={info.image} className="p-2 rounded-circle " alt="profile pic" width="50" height="50" />
                                <p>Forked by: {info.name}</p>
                            </div>
                        ))}
                    </div>

                </div>
                <div className="col-md-6 gallery-single fix">
                    <div onClick={(e) => seeMoreAboutGist(e, raw_url)} className="why-text">
                        <p><b>Filename of file:</b> {fileInfo.filename}</p>
                        <p><b>Language of file:</b> {fileInfo.language}</p>
                        <p><b>Size of file:</b> {fileInfo.size}</p>
                        <p><b>Type of file:</b> {fileInfo.type}</p>
                    </div>
                </div>
            </div>
        )
    }


    return (<>

        {/* topPhoto start */}
        <div className="page-title page-img">
            <div className="container text-center">
                <div className="row">
                    <div className="col-lg-12">
                        <h1>Search your gists</h1>
                    </div>
                </div>
            </div>
        </div>
        {/* topPhoto end */}
        {/* <!-- Start blog details --> */}
        <div className="principal-box">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="heading-title text-center">
                            <p>Enter your username to display your gists</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 form-search">
                        <input type="search" name="search" defaultValue={usernameSearch} onChange={(e) => setUsernameSearch(e.target.value)} />
                        <button type="submit" onClick={async (e) => await fetchUserGists(e)}>Search</button>
                    </div>

                </div>
                {gistsForUsers !== undefined ?
                    <div className="row special-list">
                        {gistsForUsers.map((gist) => (
                            InformationTag(gist)
                        ))}
                    </div>
                    :
                    null
                }

            </div>

        </div>

        {/* <!-- End details --> */}
    </>)
}

export default Home;