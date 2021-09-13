# React-todo-app

## 機能 
- タスク登録  
- タスク削除  
- タスク更新  

## 環境インストール方法  
- node  
https://nodejs.org/ja にてNodeをインストールする  



## 実行方法  
リポジトリをクローンする　`git clone https://github.com/kenichiiwase/React-todo.git`  
firebaseをインストールする　`npm install firebase`  
https://firebase.google.com/?hl=ja にて、コンソールへ移動後プロジェクトを作成  
![スクリーンショット 2021-09-13 205415](https://user-images.githubusercontent.com/44935028/133079229-5a84732b-d095-4a19-a98e-0c27eb5816fe.png)  
データベースの作成を押下し、コレクションへTasks、フィールドへcompleted,nameを作成  
![スクリーンショット 2021-09-13 205708](https://user-images.githubusercontent.com/44935028/133079732-5924ef96-0410-4d16-8caf-c7534ebec734.png)  
設定ボタンを押下し、プロジェクトの設定を選択  
![スクリーンショット 2021-09-13 210556](https://user-images.githubusercontent.com/44935028/133080493-9655a40e-4de9-4c1a-8194-ff67c502ba9a.png)  
`.env`へ、ファイアベースの接続情報を入力する  
ターミナルにて`npm start`を実行し、画面を起動する `http://localhost:3000/`


