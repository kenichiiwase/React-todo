# react-todo-app
タスク管理システム

## 機能 
- タスク登録  
- タスク削除  
- タスク更新  

## 環境インストール方法  
- node  
https://nodejs.org/ja にてNodeをインストールする  

- firebase   
https://firebase.google.com/?hl=ja にて、コンソールへ移動後プロジェクトを作成  
![スクリーンショット 2021-09-13 205415](https://user-images.githubusercontent.com/44935028/133079229-5a84732b-d095-4a19-a98e-0c27eb5816fe.png)  

データベースの作成を押下し、コレクションへTasks、フィールドへcompleted,nameを作成  
![スクリーンショット 2021-09-13 205708](https://user-images.githubusercontent.com/44935028/133079732-5924ef96-0410-4d16-8caf-c7534ebec734.png)  

## 実行方法  
1. `npm install`を実行    
2. `.env`ファイルを作成  
3. firebaseの接続情報を入力  
![スクリーンショット 2021-09-13 211009](https://user-images.githubusercontent.com/44935028/133081056-d71827fb-326f-4535-884d-369f4dce5f1f.png)  
![スクリーンショット 2021-09-13 211144](https://user-images.githubusercontent.com/44935028/133081250-4f86bfab-23b6-4b73-9564-c5fcd2af2e52.png)  
4. `npm start`を実行し、画面を開く
