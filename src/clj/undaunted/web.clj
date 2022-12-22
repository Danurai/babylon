(ns undaunted.web
  (:require
    [clojure.data.json :as json]
    [compojure.core :refer [context defroutes GET ANY POST]]
    [compojure.route :refer [resources]]
    [hiccup.page :as h]
    
    (ring.middleware
      [defaults       :refer :all]
      [session        :refer [wrap-session]]
      [params         :refer [wrap-params]]
      [keyword-params :refer [wrap-keyword-params]]
      [anti-forgery   :refer [wrap-anti-forgery]])
    
    [taoensso.sente :as sente]
    [taoensso.sente.server-adapters.http-kit :refer [get-sch-adapter sente-web-server-adapter]]
    [taoensso.sente.packers.transit :as sente-transit]))
    

; sente
(let [packer (sente-transit/get-transit-packer)
      {:keys [ch-recv 
              send-fn
              connected-uids
              ajax-post-fn
              ajax-get-or-ws-handshake-fn]}
      (sente/make-channel-socket! (get-sch-adapter) {:user-id-fn (fn [ring-req] (:client-id ring-req)) :packer packer})]
  (def ring-ajax-post                 ajax-post-fn)
  (def ring-ajax-get-or-ws-handshake  ajax-get-or-ws-handshake-fn)
  (def ch-chsk                        ch-recv)        ; ChannelSocket's receive channel
  (def chsk-send!                     send-fn)        ; ChannelSocket's send API fn
  (def connected-uids                 connected-uids) ; Watchable, read-only atom
)

(defn home [ req ]
  (h/html5
    [:head 
      [:script {
        :src "https://code.jquery.com/jquery-3.6.3.slim.js" 
        :integrity "sha256-DKU1CmJ8kBuEwumaLuh9Tl/6ZB6jzGOBV/5YpNE2BWc=" 
        :crossorigin="anonymous"}]]
    [:body
      [:h5 "Hello world"]
      [:button#send "Send"]
      [:div 
        [:input#client-id {:hidden false :readonly true :value (-> req :cookies (get "ring-session") :value)}]
        [:input#afg       {:hidden false :readonly true :value (-> req :anti-forgery-token)}]]
    ]
    (h/include-js "/js/comms.js")
    )
  )

(defroutes app-routes
; sente
  (GET  "/chsk"    [] ring-ajax-get-or-ws-handshake) ; ((:ajax-get-or-ws-handshake-fn channel-socket) req))
  (POST "/chsk"    [] ring-ajax-post)
; http requests
  (GET "/" [] home)
  (resources "/"))
	
(def app 
  (-> app-routes  
    (wrap-anti-forgery)
    (wrap-keyword-params)
    (wrap-params)
    (wrap-session)))


; multi to handle Sente 'events'
(defmulti event :id)

(defmethod event :chsk/ws-ping      [_])

(defmethod event :default [{:as ev-msg :keys [event]}]
  (println "Unhandled event: " event))

; Connection Management
(defmethod event :chsk/uidport-open [{:as ev-msg :keys [ring-req uid]}] 
  (println "Connected" uid))

(defmethod event :chsk/test [{:as ev-msg :keys [event uid ?data]}]
  (println uid (:action ?data))
  (chsk-send! uid [:chsk/appstate (json/write-str {:message {:state "open" :players ["p1" "p2"]}})]))

(defmethod event :chsk/uidport-close [_])

; Sente event router ('event' loop)
(defonce router
  (sente/start-chsk-router! ch-chsk event))