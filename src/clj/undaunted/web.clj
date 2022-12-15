(ns undaunted.web
  (:require
    [compojure.core :refer [context defroutes GET ANY POST]]
    [compojure.route :refer [resources]]))
    
(defroutes app-routes
  (resources "/"))
	
(def app 
  (-> app-routes))