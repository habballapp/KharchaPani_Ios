import firebase from 'react-native-firebase'

export const getData = () => {
   
    return(dispatch) => {
        var uc_data = []
        var obj1 = [];
        var i = 0; 
        var dbref = firebase.database().ref(`users/urgentcare/`);
        dbref.on("value", function(snapshot){
            snapshot.forEach(function(data){
                uc_data.push(data.val())
               
            })
        })
        dispatch({
            type:'data_accessed',
            payload: uc_data
        })
    }
}