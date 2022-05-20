package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.spring;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

import java.util.Map;

public class OnPropertyNotEmptyCondition implements Condition {

  @Override
  public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
    Map<String, Object> attrs = metadata.getAnnotationAttributes(ConditionalOnPropertyNotEmpty.class.getName());
    String propertyName = (String) attrs.get("value");
    String val = context.getEnvironment().getProperty(propertyName);
    return val != null && !val.trim().isEmpty();
  }
}
