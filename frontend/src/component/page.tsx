import React, {Component} from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

import TopBar from './topbar'

export default class Page extends Component {
    componentDidMount() {
        if (!Cookies.get('csrftoken'))
            this.getCookie();
    }

    async getCookie() {
        axios.get('/api/csrf')
        .then((response) => Cookies.set('csrftoken', response.data.token))
    }

    render() {
        return(
            <>
            <TopBar/>

            </>
        )
    }
}