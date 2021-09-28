$fn = 64;

// Cherry MX
// https://cdn.sparkfun.com/datasheets/Components/Switches/MX%20Series.pdf

// Diode (1N4148)
// https://www.vishay.com/docs/81857/1n4148.pdf

grid = 1.27;

pin_dia = 1.5 * 0.95;
pin1 = [3*grid, 2*grid];
pin2 = [-2*grid, 4*grid];

stem = 4.0 * 0.96;

base = [11*grid, 11*grid, 3.5];

diode = [1.75 * 1.25, 3.4 * 1.25];
diode_dia = 0.56 * 1.5;
wire_dia = 0.5 * 1.5;

diode_angle = -6;

difference(){
    make_body();
    
    //pcb_mount_pegs();

    wire_slots();

    diode_slot();
}

module make_body(){
    difference(){
        cube([base.x, base.y, base.z], center = true);

        // Main Stem Clamp
        cylinder(h=base.z*2, d=stem, center = true);
        
        translate([0, -5, 0]){
            cube([3, 10, base.z*2], center = true);
        }

        // Switch Pins
        translate([pin1.x, pin1.y, 0]){
            cylinder(h=base.z*2, d=pin_dia, center = true);
        }
        
        translate([pin2.x, pin2.y, 0]){
            cylinder(h=base.z*2, d=pin_dia, center = true);
        }
    }
}

module pcb_mount_pegs() {
    peg1 = [-4*grid, 0, 2.1];
    peg2 = [4*grid, 0, 2.1];
 
    translate([peg1.x, peg1.y, 0]){
        cylinder(h=base.z*2, d=peg1[2], center = true);
    }

    translate([peg2.x, peg2.y, 0]){
        cylinder(h=base.z*2, d=peg2[2], center = true);
    }
}

module wire_slots(){
    translate([pin1.x, 4*grid, -base.z/2])
        cube([wire_dia, 4*grid, 2*wire_dia], center = true);
    translate([pin1.x, 5.5*grid, 0])
        cube([wire_dia, 2*wire_dia, base.z], center = true);
}

module diode_slot(){
    module top_lines() {
        translate([-2*grid, 5*grid, 0])
            cube([diode_dia, base.y/2-pin2.y, base.z*2], center = true);

        translate([-4*grid, 4.5*grid, -base.z/2])
            cube([5, diode_dia, 2*diode_dia], center = true);

        translate([(-base.x/2)+diode_dia/2, 4.5*grid, 0])
            cube([diode_dia, diode_dia, base.z*2], center = true);
    }
    
    module bottom_lines() {
        translate([0, -4*grid, base.z/2])
            cube([base.x, diode_dia, base.z], center = true);
        
        translate([(-base.x/2)+diode_dia/2, -4*grid, 0])
            cube([diode_dia, diode_dia, base.z*2], center = true);
        
        translate([-4*grid, -4*grid, -base.z/2])
            cube([3, diode_dia, 2*diode_dia], center = true);
    }
    
    // Diode Body
    translate([-1.6*diode.x, -2*grid, -diode.x/2])
        rotate([0, 0, diode_angle]){
            cube([diode.x, diode.y, diode.x], center = true);
        } 
    
    top_lines();
    bottom_lines();

    translate([-2.7*grid, -2*grid, -base.z/2])
        rotate([0, 0, diode_angle]){
            translate([0, 2.2, 0])
                cube([diode_dia, 10, diode_dia*2], center = true);
            translate([-0.2, -2.3, 0])
                cylinder(h=diode_dia*2, d=1.5, center = true);
        }
}
