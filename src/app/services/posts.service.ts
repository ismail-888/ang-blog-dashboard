import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private storage: AngularFireStorage,
     private afs: AngularFirestore,
      private toastr: ToastrService,
      private router:Router,
      ) { }

  uploadImage(selectedImage: any, postData: Post , formStatus:string,id:any) {
    const filePath = `postIMG/${Date.now()}`
    console.log(filePath)

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('post image uplaoded successfuly..!');

      this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
        postData.postImagePath = URL;
        console.log(postData);

        if(formStatus=='Edit'){
          this.updateData(id,postData)
        }else{
          this.saveData(postData);
        }

      })
    })
  }

  saveData(postData: Post) {
    this.afs.collection('post').add(postData).then(docRef => {
      this.toastr.success('Data Insert Successfully ')
      this.router.navigate(['/posts'])
    })
  }

  loadData() {
    return this.afs
      .collection('post')
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Post;
            const id = a.payload.doc.id;
            return { id, data };
          })
        )
      );
  }

  loadOneData(id:string){
    return this.afs.doc(`post/${id}`).valueChanges();
  }


  updateData(id: any,postData: any){
    this.afs.doc(`post/${id}`).update(postData).then(()=>{
      this.toastr.success('Data Updated Successfully');
      this.router.navigate(['/posts']);
    })
  }


  deleteImage(postImgPath: string,id:string){
    this.storage.storage.refFromURL(postImgPath).delete().then(()=>{
        this.deleteData(id);
    })
  }
  
  deleteData(id:string){
    this.afs.doc(`post/${id}`).delete().then(()=>{
      this.toastr.warning('Data Deleted ..!')
    })
  }

  markFeatured(id:string,featuredData:object){
    this.afs.doc(`post/${id}`).update(featuredData).then(()=>{
      this.toastr.info('Featured Status Updated')
    })
  }

}
