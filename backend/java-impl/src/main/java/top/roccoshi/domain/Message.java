package top.roccoshi.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.Objects;

public class Message implements Serializable {
    @JsonProperty("source")
    private String source;

    @JsonProperty("content")
    private String content;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Message)) return false;
        Message message = (Message) o;
        return Objects.equals(getSource(), message.getSource()) && Objects.equals(getContent(), message.getContent());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getSource(), getContent());
    }
}
