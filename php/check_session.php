<?php

function checkSession($requiredRole) {
    session_start();
    
    // Verificar que tenga sesión iniciada
    if (!isset($_SESSION['user_id'])) {
        return false;
    }
    
    // Verificar que tenga el rol guardado en sesión
    if (!isset($_SESSION['user_role'])) {
        // Si no tiene rol en sesión, verificar en la base de datos
        require_once __DIR__ . '/db.php';
        
        $tables = [
            'autor' => 'autor',
            'revisor' => 'revisor',
            'manager' => 'manager'
        ];
        
        if (!isset($tables[$requiredRole])) {
            return false;
        }
        
        $table = $tables[$requiredRole];
        $stmt = $conn->prepare("SELECT id FROM $table WHERE id = ? LIMIT 1");
        $stmt->bind_param("i", $_SESSION['user_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $_SESSION['user_role'] = $requiredRole;
            return true;
        }
        
        return false;
    }
    
    // Verificar que el rol coincida
    return $_SESSION['user_role'] === $requiredRole;
}

/**
 * Redirige al login si no tiene acceso
 */
function requireAuth($requiredRole) {
    if (!checkSession($requiredRole)) {
        header('Location: ../webpages/login.html');
        exit;
    }
}
?>