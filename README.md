# blog-postgre-backend
Système de blog développé avec le framework Express.JS et base de données PostgreSQL
### Système de formulaire dynamique : se base sur un fichier de structure correspondant aux données attendues en bdd => reusableForm

## Fonctionnalités
+ Home affichant des articles sous forme de card par catégorie
+ Affichage d'un article dans une page dédiée

## Fonctionnalités d'administration
+ Accès Administration des articles dans le home
+ Gestion des catégories d'articles
+ Gestion des articles
+ Gestion des commentaires 
+ Gestion des utilisateurs
+ Stockage des images dans cloudinary
+ Si je change l'image dans le formulaire de post, celle sur cloudinary est détruite avant d'ajouter la nouvelle
+ Editeur Wysiwyg pour le contenu de l'article

## Fonctionnalités suivantes 
+ Sécurisation de l'accès Administration
+ Connexion utilisateur Google ou classique
+ Ajout des commentaires aux articles si utilisateur connecté

## Mes réussites techniques
+ Formulaire géré dynamiquement dans React, basé sur un fichier de datas structuré, pour exemple :
```
{
  source:'articles',
  label:'articles',
  identifier:'articles_id',
  inputs:
  [
    {
      label:'Titre de l'article',
      field :'title',
      type:'string',
      required:true,
      placeholder:'le titre de l'article'
     }
     ,{
      label:'Contenu de l'article',
      field:'content',
      type:'longtext',
      required:true,
      placeholder:'le contenu de l'article'
     },
     {
      label:'Catégorie',
      field:'categorie_id',
      type:'entity',
      entity:'articlecategories',
      displayinselect:'title',
      valueinselect:'categorie_id',
      comments:'permet de choisir l\'utilisateur dans la liste d\'utilisateur',
      required:true,
      placeholder:'Choisir l\'utilisateur'
     }
     ,{
      label:'Archivé',
      field:'isarchived',
      type:'boolean',
      required:false,
      placeholder:'Cocher s\'il est archivé'
     }
  ]
}
```