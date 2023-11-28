import {post} from "./Api"

export function removeConstant(requestRedraw) {
    // potentially modify the model
    let nameField = document.getElementById("constant-name")

     // prepare payload for the post
    let data = { 'name': nameField.value }
 
    const handler = (json) => {
        console.log(json)
        // clear inputs
        nameField.value = ''
        requestRedraw()
    }

    post('/constants/delete', data, handler)
}