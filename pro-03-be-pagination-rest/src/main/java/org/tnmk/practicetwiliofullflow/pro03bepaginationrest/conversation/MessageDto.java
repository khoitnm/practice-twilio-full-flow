package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import java.net.URI;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

public class MessageDto {
  private String accountSid;
  private String conversationSid;
  private String sid;
  private Integer index;
  /**
   * This is the user.identity (and participant.identity) of the author
   */
  private String author;
  /**
   * This is the participant.sid (which is different from user.sid) of the author
   */
  private String participantSid;

  private String body;
  private List<Map<String, Object>> media;
  private Map<String, String> attributes;
  private OffsetDateTime dateCreated;
  private OffsetDateTime dateUpdated;
  private URI url;
  private Map<String, Object> delivery;
  private Map<String, String> links;

  public String getAccountSid() {
    return accountSid;
  }

  public void setAccountSid(String accountSid) {
    this.accountSid = accountSid;
  }

  public String getConversationSid() {
    return conversationSid;
  }

  public void setConversationSid(String conversationSid) {
    this.conversationSid = conversationSid;
  }

  public String getSid() {
    return sid;
  }

  public void setSid(String sid) {
    this.sid = sid;
  }

  public Integer getIndex() {
    return index;
  }

  public void setIndex(Integer index) {
    this.index = index;
  }

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public List<Map<String, Object>> getMedia() {
    return media;
  }

  public void setMedia(List<Map<String, Object>> media) {
    this.media = media;
  }

  public Map<String, String> getAttributes() {
    return attributes;
  }

  public void setAttributes(Map<String, String> attributes) {
    this.attributes = attributes;
  }

  public String getParticipantSid() {
    return participantSid;
  }

  public void setParticipantSid(String participantSid) {
    this.participantSid = participantSid;
  }

  public URI getUrl() {
    return url;
  }

  public void setUrl(URI url) {
    this.url = url;
  }

  public Map<String, Object> getDelivery() {
    return delivery;
  }

  public void setDelivery(Map<String, Object> delivery) {
    this.delivery = delivery;
  }

  public Map<String, String> getLinks() {
    return links;
  }

  public void setLinks(Map<String, String> links) {
    this.links = links;
  }

  public OffsetDateTime getDateCreated() {
    return dateCreated;
  }

  public void setDateCreated(OffsetDateTime dateCreated) {
    this.dateCreated = dateCreated;
  }

  public OffsetDateTime getDateUpdated() {
    return dateUpdated;
  }

  public void setDateUpdated(OffsetDateTime dateUpdated) {
    this.dateUpdated = dateUpdated;
  }
}
