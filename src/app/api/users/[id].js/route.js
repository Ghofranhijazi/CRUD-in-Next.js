import connectDb from '../../../../lib/dbConnect';
import User from '../../../../models/User';


// PUT: لتحديث بيانات مستخدم حسب الـ ID
export const PUT = async (req, { params }) => {
  const { id } = params; // الحصول على الـ ID من المسار
  try {
    await connectDb();
    const { name, email } = await req.json();
    const updatedUser = await User.findByIdAndUpdate(
      id, // استخدام الـ ID لتحديث المستخدم
      { name, email },
      { new: true }
    );
    if (!updatedUser) {
      return new Response('User not found', { status: 404 });
    }
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new Response('Error updating user', { status: 500 });
  }
};

// DELETE: لحذف مستخدم (Soft Delete) حسب الـ ID
export const DELETE = async (req, { params }) => {
  const { id } = params; // الحصول على الـ ID من المسار
  try {
    await connectDb();
    const deletedUser = await User.findByIdAndUpdate(
      id, // استخدام الـ ID لحذف المستخدم (تغيير حالته إلى غير نشط)
      { isActive: false },
      { new: true }
    );
    if (!deletedUser) {
      return new Response('User not found', { status: 404 });
    }
    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    return new Response('Error deleting user', { status: 500 });
  }
};
