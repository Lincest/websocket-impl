package main

/**
    go_impl
    @author: roccoshi
    @desc: websocket
**/
import (
	"encoding/json"
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var addr = flag.String("addr", "localhost:8080", "http service address")

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
} // use default options

func echo(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Printf("msgType: %d, recv: %s", mt, message)
		var res map[string]interface{}
		if json.Unmarshal(message, &res) != nil {
			log.Println("unmarshal error: ", err)
		}
		if _, ok := res["source"]; !ok {
			log.Println("message miss: source")
			break
		}
		if _, ok := res["content"]; !ok {
			log.Println("message miss:message")
			break
		}
		res["source"] = "go-backend"
		data, _ := json.Marshal(&res)
		err = c.WriteMessage(mt, data)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/echo", echo)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
