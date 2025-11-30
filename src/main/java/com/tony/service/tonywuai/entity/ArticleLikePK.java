package com.tony.service.tonywuai.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

/**
 * t_article_like 表的联合主键类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleLikePK implements Serializable {

    private Long articleId;
    private Long userId;
}