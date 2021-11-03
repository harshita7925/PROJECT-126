import * as React from "react";
import { View, Button, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component{
    state={
        image:null
    }
    render(){
        let {image}=this.state
        return(
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                <Button title="Pick an Image"
                   onPress={this.pickImage}/>
            </View>
        )
    }
    getPermissionsAsync=async()=>{
        if (Platform.OS!=="web"){
            const{status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status!=="granted"){
                alert("Sorry, we need camera roll permission to make this work!")
            }
        }
    };
    componentDidMount(){
        this.getPermissionsAsync()
    }
    pickImage=async()=>{
        try{
            let result=await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({
                    image:result.data
                })
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(E){
            console.log(E)
        }
    }
    uploadImage=async(uri)=>{
        const data=new FormData()
        let fileName=uri.split("/")[uri.split("/").length-1]
        let type=`image/${uri.split(".")[uri.split(".").length-1]}`
        const fileToUpload={
            uri:uri,
            name:fileName,
            type:type,
        };
        data.append("digit",fileToUpload);
        fetch("",{
            method:"POST",
            body:data,
            headers:{
                "content-type":"multipart/form-data",
        },
    })
        .then((response)=>response.json())
        .then((result)=>{
            console.log("Success",result);
        })
        .catch((error)=>{
            console.log("Error");
        });
    };
}