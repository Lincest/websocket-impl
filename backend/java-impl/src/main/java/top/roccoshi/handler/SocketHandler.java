package top.roccoshi.handler;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import top.roccoshi.domain.Message;

import java.util.concurrent.ConcurrentHashMap;

public class SocketHandler extends TextWebSocketHandler {
    private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("new websocket connection");
        sessions.put(session.getId(), session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            Message msg = new ObjectMapper().readValue(message.getPayload(), Message.class);
            System.out.println("msg: " + msg);
            msg.setSource("java-backend");
            session.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(msg)));
        } catch (JacksonException e) {
            System.out.println("read data failed");
            Message msg = new Message();
            msg.setSource("java-backend");
            msg.setContent("received wrong type message");
            session.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(msg)));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("websocket connection is closed");
        sessions.remove(session.getId());
        System.out.println("now sessions: " + sessions.size());
    }
}
