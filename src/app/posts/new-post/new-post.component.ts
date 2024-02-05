import { Post } from './../../models/post';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Params  } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = '';
  imgSrc: any = './assets/no-image.jpg';
  selectedImg: any;

  categories!: Category[];
  postForm!: FormGroup;
  post :any;
  formStatus:string='Add New';
  docId!:string;

  constructor(
    private categoryService: CategoriesService,
     private fb: FormBuilder,
     private postService:PostsService,
     private route:ActivatedRoute,
     ) {

      this.route.queryParams.subscribe(val=>{

        this.docId=val['id'];


        if(this.docId){
          this.postService.loadOneData(val['id']).subscribe(post=>{

            this.post=post;
    
            this.postForm = this.fb.group({
              title: [this.post.title,[Validators.required,Validators.minLength(10)]],
              permalink: [{ value: this.post.permalink, disabled: true }, Validators.required],
              excerpt: [this.post.excerpt,[Validators.required,Validators.minLength(50)]],
              category: [`${this.post.category.categoryId}-${this.post.category.category}`,Validators.required],
              postImg: ['',Validators.required],
              content: [this.post.content,Validators.required],
            })
    
            this.imgSrc=this.post.postImagePath
            this.formStatus="Edit";
    
           })
        }else{
          this.postForm = this.fb.group({
            title: ['',[Validators.required,Validators.minLength(10)]],
            permalink: [{ value: '', disabled: true }, Validators.required],
            excerpt: ['',[Validators.required,Validators.minLength(50)]],
            category: ['',Validators.required],
            postImg: ['',Validators.required],
            content: ['',Validators.required],
          })

        }

      

      })
   
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val: any) => {
      this.categories = val
    })
  }

  get fc(){
    return this.postForm.controls;
  }



  onTitleChanged($event: KeyboardEvent) {
    const title = ($event.target as HTMLInputElement).value;
    this.permalink = title.replace(/\s/g, '-')
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result
    }

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }


  onSubmit(){
    
    if (this.postForm) {
      const permalinkControl = this.postForm.get('permalink');
      
      // Check if permalinkControl is not null before calling enable
      if (permalinkControl) {
        permalinkControl.enable();
      }
    }

    // code 
    console.log(this.postForm.value)

    let splitted=this.postForm.value.category.split('-');


    const postData:Post={
      title:this.postForm.value.title,
      permalink:this.postForm.value.permalink,
      category:{
        categoryId:splitted[0],
        category:splitted[1],
      },
      postImagePath:'',
      excerpt:this.postForm.value.excerpt,
      content:this.postForm.value.content,
      isFeatured:false,
      views:0,
      status:'new',
      createdAt:new Date()
    }

    this.postService.uploadImage(this.selectedImg,postData,this.formStatus,this.docId);
    this.postForm.reset();
    this.imgSrc='./assets/no-image.jpg';

    if (this.postForm) {
      const permalinkControl = this.postForm.get('permalink');
      
      if (permalinkControl) {
        permalinkControl.disable();
      }
    }


  }

}
