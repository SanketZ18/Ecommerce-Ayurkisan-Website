package com.ayurkisan.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ayurkisan.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // ✅ Skip Swagger and Auth endpoints
        if (path.startsWith("/v3/api-docs") ||
            path.startsWith("/swagger-ui") ||
            path.startsWith("/swagger-ui.html") ||
            path.startsWith("/api/auth")) {

            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {

                if (jwtUtil.validateToken(token)) {

                    String userId = jwtUtil.extractUserId(token);
                    String role = jwtUtil.extractRole(token);

                    // Store in request attributes
                    request.setAttribute("userId", userId);
                    request.setAttribute("role", role);
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid Token");
                    return;
                }

            }  catch (io.jsonwebtoken.ExpiredJwtException |
         io.jsonwebtoken.MalformedJwtException |
         io.jsonwebtoken.UnsupportedJwtException |
         io.jsonwebtoken.security.SignatureException |
         IllegalArgumentException e) {

    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, 
                       "Invalid or Expired Token");
    return;
}
        }

        filterChain.doFilter(request, response);
    }
}
