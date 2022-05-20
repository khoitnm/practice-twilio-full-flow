package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.spring;

import org.springframework.context.annotation.Conditional;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Conditional(OnPropertyNotEmptyCondition.class)
public @interface ConditionalOnPropertyNotEmpty {
  /**
   * the property name which you would configure in application-xxx.yml (or application-xxx.properties)
   */
  String value();

}